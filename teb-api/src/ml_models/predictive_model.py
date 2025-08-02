import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import datetime
import pickle
import os

class TurbinePredictiveModel:
    def __init__(self):
        self.failure_model = None
        self.availability_model = None
        self.anomaly_detector = None
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def generate_training_data(self):
        """Gera dados sintéticos para treinamento baseados nos padrões reais"""
        np.random.seed(42)
        
        # Dados base das turbinas
        turbines = ['TEB001', 'TEB002', 'TEB003', 'TEB004', 'TEB005', 'TEB006', 'TEB007', 'TEB008']
        
        # Gerar 6 meses de dados históricos (180 dias)
        dates = pd.date_range(start='2025-01-01', end='2025-06-30', freq='D')
        
        data = []
        
        for turbine in turbines:
            base_failure_rate = {
                'TEB001': 0.8, 'TEB002': 0.4, 'TEB003': 0.3, 'TEB004': 0.5,
                'TEB005': 0.3, 'TEB006': 0.3, 'TEB007': 0.3, 'TEB008': 0.3
            }[turbine]
            
            base_availability = {
                'TEB001': 26.24, 'TEB002': 97.07, 'TEB003': 98.52, 'TEB004': 92.88,
                'TEB005': 96.88, 'TEB006': 98.19, 'TEB007': 97.96, 'TEB008': 97.97
            }[turbine]
            
            for date in dates:
                # Fatores ambientais
                day_of_year = date.timetuple().tm_yday
                seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * day_of_year / 365)
                
                wind_speed = np.random.normal(12, 3)
                wind_speed = max(0, min(25, wind_speed))
                
                temperature = 25 + 10 * np.sin(2 * np.pi * day_of_year / 365) + np.random.normal(0, 5)
                temperature = max(-10, min(45, temperature))
                
                humidity = np.random.normal(60, 15)
                humidity = max(0, min(100, humidity))
                
                # Fatores operacionais
                operating_hours = np.random.normal(20, 4)
                operating_hours = max(0, min(24, operating_hours))
                
                power_output = min(2.5, max(0, wind_speed * 0.15 + np.random.normal(0, 0.2)))
                
                vibration_level = np.random.normal(2, 0.5) * (1 + 0.1 * (wind_speed - 12))
                vibration_level = max(0, vibration_level)
                
                # Idade da turbina (em dias desde início do ano)
                turbine_age = (date - pd.Timestamp('2025-01-01')).days
                
                # Manutenção recente (simulada)
                days_since_maintenance = np.random.exponential(30)
                
                # Calcular probabilidade de falha
                failure_prob = base_failure_rate * seasonal_factor
                failure_prob *= (1 + 0.01 * turbine_age)  # Degradação com o tempo
                failure_prob *= (1 + max(0, (wind_speed - 15) * 0.05))  # Vento alto
                failure_prob *= (1 + max(0, (temperature - 35) * 0.02))  # Temperatura alta
                failure_prob *= (1 + max(0, (vibration_level - 3) * 0.1))  # Vibração alta
                failure_prob *= (1 + max(0, (days_since_maintenance - 60) * 0.005))  # Manutenção atrasada
                
                # Normalizar probabilidade
                failure_prob = min(1.0, max(0.0, failure_prob))
                
                # Calcular disponibilidade
                availability = base_availability
                availability *= (1 - 0.1 * failure_prob)  # Redução por falhas
                availability *= (1 - max(0, (wind_speed - 20) * 0.01))  # Vento extremo
                availability = min(100, max(0, availability))
                
                # Simular falha real
                has_failure = np.random.random() < failure_prob / 10  # Reduzir frequência
                
                data.append({
                    'turbine_id': turbine,
                    'date': date,
                    'wind_speed': wind_speed,
                    'temperature': temperature,
                    'humidity': humidity,
                    'operating_hours': operating_hours,
                    'power_output': power_output,
                    'vibration_level': vibration_level,
                    'turbine_age': turbine_age,
                    'days_since_maintenance': days_since_maintenance,
                    'failure_probability': failure_prob,
                    'availability': availability,
                    'has_failure': has_failure
                })
        
        return pd.DataFrame(data)
    
    def prepare_features(self, df):
        """Prepara features para o modelo"""
        features = [
            'wind_speed', 'temperature', 'humidity', 'operating_hours',
            'power_output', 'vibration_level', 'turbine_age', 'days_since_maintenance'
        ]
        
        # Adicionar features derivadas
        df['wind_temp_interaction'] = df['wind_speed'] * df['temperature']
        df['power_efficiency'] = df['power_output'] / (df['wind_speed'] + 0.1)
        df['maintenance_urgency'] = np.log1p(df['days_since_maintenance'])
        
        features.extend(['wind_temp_interaction', 'power_efficiency', 'maintenance_urgency'])
        
        return df[features]
    
    def train_models(self):
        """Treina os modelos preditivos"""
        print("Gerando dados de treinamento...")
        df = self.generate_training_data()
        
        print("Preparando features...")
        X = self.prepare_features(df)
        
        # Normalizar features
        X_scaled = self.scaler.fit_transform(X)
        
        # Treinar modelo de previsão de falhas
        print("Treinando modelo de previsão de falhas...")
        y_failure = df['failure_probability']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_failure, test_size=0.2, random_state=42)
        
        self.failure_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.failure_model.fit(X_train, y_train)
        
        # Avaliar modelo de falhas
        y_pred = self.failure_model.predict(X_test)
        failure_mae = mean_absolute_error(y_test, y_pred)
        failure_r2 = r2_score(y_test, y_pred)
        print(f"Modelo de falhas - MAE: {failure_mae:.4f}, R²: {failure_r2:.4f}")
        
        # Treinar modelo de disponibilidade
        print("Treinando modelo de disponibilidade...")
        y_availability = df['availability']
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_availability, test_size=0.2, random_state=42)
        
        self.availability_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.availability_model.fit(X_train, y_train)
        
        # Avaliar modelo de disponibilidade
        y_pred = self.availability_model.predict(X_test)
        availability_mae = mean_absolute_error(y_test, y_pred)
        availability_r2 = r2_score(y_test, y_pred)
        print(f"Modelo de disponibilidade - MAE: {availability_mae:.4f}, R²: {availability_r2:.4f}")
        
        # Treinar detector de anomalias
        print("Treinando detector de anomalias...")
        self.anomaly_detector = IsolationForest(contamination=0.1, random_state=42)
        self.anomaly_detector.fit(X_scaled)
        
        self.is_trained = True
        print("Treinamento concluído!")
        
        return {
            'failure_mae': failure_mae,
            'failure_r2': failure_r2,
            'availability_mae': availability_mae,
            'availability_r2': availability_r2
        }
    
    def predict_failure_probability(self, turbine_data):
        """Prediz probabilidade de falha para uma turbina"""
        if not self.is_trained:
            raise ValueError("Modelo não foi treinado ainda")
        
        # Preparar dados
        df = pd.DataFrame([turbine_data])
        X = self.prepare_features(df)
        X_scaled = self.scaler.transform(X)
        
        # Fazer previsão
        failure_prob = self.failure_model.predict(X_scaled)[0]
        availability = self.availability_model.predict(X_scaled)[0]
        
        # Detectar anomalia
        anomaly_score = self.anomaly_detector.decision_function(X_scaled)[0]
        is_anomaly = self.anomaly_detector.predict(X_scaled)[0] == -1
        
        return {
            'failure_probability': max(0, min(1, failure_prob)),
            'predicted_availability': max(0, min(100, availability)),
            'anomaly_score': anomaly_score,
            'is_anomaly': is_anomaly
        }
    
    def get_feature_importance(self):
        """Retorna importância das features"""
        if not self.is_trained:
            return None
        
        feature_names = [
            'wind_speed', 'temperature', 'humidity', 'operating_hours',
            'power_output', 'vibration_level', 'turbine_age', 'days_since_maintenance',
            'wind_temp_interaction', 'power_efficiency', 'maintenance_urgency'
        ]
        
        failure_importance = dict(zip(feature_names, self.failure_model.feature_importances_))
        availability_importance = dict(zip(feature_names, self.availability_model.feature_importances_))
        
        return {
            'failure_prediction': failure_importance,
            'availability_prediction': availability_importance
        }
    
    def save_model(self, filepath):
        """Salva o modelo treinado"""
        model_data = {
            'failure_model': self.failure_model,
            'availability_model': self.availability_model,
            'anomaly_detector': self.anomaly_detector,
            'scaler': self.scaler,
            'is_trained': self.is_trained
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_model(self, filepath):
        """Carrega modelo salvo"""
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            
            self.failure_model = model_data['failure_model']
            self.availability_model = model_data['availability_model']
            self.anomaly_detector = model_data['anomaly_detector']
            self.scaler = model_data['scaler']
            self.is_trained = model_data['is_trained']
            
            return True
        return False

# Instância global do modelo
predictive_model = TurbinePredictiveModel()

