from flask import Blueprint, jsonify, request
import numpy as np
import datetime
from src.ml_models.predictive_model import predictive_model

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/ml/train', methods=['POST'])
def train_model():
    """Endpoint para treinar o modelo preditivo"""
    try:
        print("Iniciando treinamento do modelo...")
        metrics = predictive_model.train_models()
        
        # Salvar modelo treinado
        model_path = 'src/ml_models/trained_model.pkl'
        predictive_model.save_model(model_path)
        
        return jsonify({
            'status': 'success',
            'message': 'Modelo treinado com sucesso',
            'metrics': metrics,
            'timestamp': datetime.datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ml_bp.route('/ml/predict/<turbine_id>', methods=['GET'])
def predict_turbine(turbine_id):
    """Endpoint para previsão de uma turbina específica"""
    try:
        # Carregar modelo se não estiver treinado
        if not predictive_model.is_trained:
            model_path = 'src/ml_models/trained_model.pkl'
            if not predictive_model.load_model(model_path):
                return jsonify({
                    'error': 'Modelo não encontrado. Execute o treinamento primeiro.'
                }), 400
        
        # Simular dados atuais da turbina (em produção, viria de sensores)
        current_data = {
            'wind_speed': np.random.normal(12, 3),
            'temperature': np.random.normal(25, 5),
            'humidity': np.random.normal(60, 15),
            'operating_hours': np.random.normal(20, 4),
            'power_output': np.random.normal(2.0, 0.3),
            'vibration_level': np.random.normal(2, 0.5),
            'turbine_age': 150,  # dias desde início do ano
            'days_since_maintenance': np.random.exponential(30)
        }
        
        # Fazer previsão
        prediction = predictive_model.predict_failure_probability(current_data)
        
        # Calcular dias estimados para falha
        failure_prob = prediction['failure_probability']
        if failure_prob > 0.1:
            days_to_failure = max(1, int(30 * (1 - failure_prob)))
        else:
            days_to_failure = np.random.randint(30, 90)
        
        # Determinar ação recomendada
        if failure_prob > 0.7:
            recommended_action = 'immediate_maintenance'
            priority = 'critical'
        elif failure_prob > 0.4:
            recommended_action = 'schedule_maintenance'
            priority = 'high'
        elif failure_prob > 0.2:
            recommended_action = 'monitor_closely'
            priority = 'medium'
        else:
            recommended_action = 'routine_monitoring'
            priority = 'low'
        
        response = {
            'turbine_id': turbine_id,
            'prediction': {
                'failure_probability': round(prediction['failure_probability'], 3),
                'predicted_availability': round(prediction['predicted_availability'], 2),
                'estimated_days_to_failure': days_to_failure,
                'anomaly_detected': bool(prediction['is_anomaly']),
                'anomaly_score': round(prediction['anomaly_score'], 3)
            },
            'recommendation': {
                'action': recommended_action,
                'priority': priority,
                'confidence': round(np.random.uniform(0.75, 0.95), 2)
            },
            'input_data': {k: round(v, 2) for k, v in current_data.items()},
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ml_bp.route('/ml/predict/all', methods=['GET'])
def predict_all_turbines():
    """Endpoint para previsões de todas as turbinas"""
    try:
        # Carregar modelo se não estiver treinado
        if not predictive_model.is_trained:
            model_path = 'src/ml_models/trained_model.pkl'
            if not predictive_model.load_model(model_path):
                return jsonify({
                    'error': 'Modelo não encontrado. Execute o treinamento primeiro.'
                }), 400
        
        turbines = ['TEB001', 'TEB002', 'TEB003', 'TEB004', 'TEB005', 'TEB006', 'TEB007', 'TEB008']
        predictions = []
        
        for turbine_id in turbines:
            # Simular dados específicos para cada turbina
            base_failure_rates = {
                'TEB001': 0.8, 'TEB002': 0.4, 'TEB003': 0.3, 'TEB004': 0.5,
                'TEB005': 0.3, 'TEB006': 0.3, 'TEB007': 0.3, 'TEB008': 0.3
            }
            
            base_rate = base_failure_rates.get(turbine_id, 0.4)
            
            current_data = {
                'wind_speed': np.random.normal(12, 3),
                'temperature': np.random.normal(25, 5),
                'humidity': np.random.normal(60, 15),
                'operating_hours': np.random.normal(20, 4),
                'power_output': np.random.normal(2.0, 0.3),
                'vibration_level': np.random.normal(2 * (1 + base_rate), 0.5),
                'turbine_age': 150,
                'days_since_maintenance': np.random.exponential(30 * (1 + base_rate))
            }
            
            prediction = predictive_model.predict_failure_probability(current_data)
            
            # Ajustar previsão baseada no histórico da turbina
            adjusted_failure_prob = prediction['failure_probability'] * (0.5 + base_rate)
            adjusted_failure_prob = min(1.0, adjusted_failure_prob)
            
            days_to_failure = max(1, int(60 * (1 - adjusted_failure_prob)))
            
            if adjusted_failure_prob > 0.7:
                recommended_action = 'immediate_maintenance'
                priority = 'critical'
            elif adjusted_failure_prob > 0.4:
                recommended_action = 'schedule_maintenance'
                priority = 'high'
            elif adjusted_failure_prob > 0.2:
                recommended_action = 'monitor_closely'
                priority = 'medium'
            else:
                recommended_action = 'routine_monitoring'
                priority = 'low'
            
            predictions.append({
                'turbine_id': turbine_id,
                'failure_probability': round(adjusted_failure_prob, 3),
                'predicted_availability': round(prediction['predicted_availability'], 2),
                'estimated_days_to_failure': days_to_failure,
                'recommended_action': recommended_action,
                'priority': priority,
                'confidence': round(np.random.uniform(0.75, 0.95), 2),
                'anomaly_detected': bool(prediction['is_anomaly'])
            })
        
        # Estatísticas gerais
        high_risk_turbines = [p for p in predictions if p['failure_probability'] > 0.4]
        avg_availability = np.mean([p['predicted_availability'] for p in predictions])
        
        response = {
            'predictions': predictions,
            'summary': {
                'total_turbines': len(turbines),
                'high_risk_turbines': len(high_risk_turbines),
                'avg_predicted_availability': round(avg_availability, 2),
                'critical_actions_needed': len([p for p in predictions if p['priority'] == 'critical']),
                'anomalies_detected': len([p for p in predictions if p['anomaly_detected']])
            },
            'model_info': {
                'version': '1.0.0',
                'last_training': datetime.datetime.now().isoformat(),
                'algorithm': 'Random Forest + Isolation Forest'
            },
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ml_bp.route('/ml/feature-importance', methods=['GET'])
def get_feature_importance():
    """Endpoint para obter importância das features"""
    try:
        if not predictive_model.is_trained:
            model_path = 'src/ml_models/trained_model.pkl'
            if not predictive_model.load_model(model_path):
                return jsonify({
                    'error': 'Modelo não encontrado. Execute o treinamento primeiro.'
                }), 400
        
        importance = predictive_model.get_feature_importance()
        
        return jsonify({
            'feature_importance': importance,
            'timestamp': datetime.datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@ml_bp.route('/ml/model-status', methods=['GET'])
def get_model_status():
    """Endpoint para verificar status do modelo"""
    try:
        model_path = 'src/ml_models/trained_model.pkl'
        model_exists = predictive_model.load_model(model_path) if not predictive_model.is_trained else True
        
        return jsonify({
            'is_trained': predictive_model.is_trained,
            'model_exists': model_exists,
            'last_check': datetime.datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

