from flask import Blueprint, jsonify, request
import random
import datetime
import time

turbine_bp = Blueprint('turbine', __name__)

# Dados base das turbinas
TURBINES_BASE_DATA = {
    'TEB001': {'base_failures': 40, 'base_mttr': 73.46, 'base_availability': 26.24, 'criticality': 'alta'},
    'TEB002': {'base_failures': 33, 'base_mttr': 3.54, 'base_availability': 97.07, 'criticality': 'media'},
    'TEB003': {'base_failures': 27, 'base_mttr': 2.19, 'base_availability': 98.52, 'criticality': 'baixa'},
    'TEB004': {'base_failures': 46, 'base_mttr': 6.17, 'base_availability': 92.88, 'criticality': 'media'},
    'TEB005': {'base_failures': 24, 'base_mttr': 5.18, 'base_availability': 96.88, 'criticality': 'baixa'},
    'TEB006': {'base_failures': 30, 'base_mttr': 2.41, 'base_availability': 98.19, 'criticality': 'baixa'},
    'TEB007': {'base_failures': 25, 'base_mttr': 3.25, 'base_availability': 97.96, 'criticality': 'baixa'},
    'TEB008': {'base_failures': 26, 'base_mttr': 3.11, 'base_availability': 97.97, 'criticality': 'baixa'}
}

def generate_real_time_data():
    """Gera dados em tempo real com pequenas variações"""
    current_time = datetime.datetime.now()
    
    # Simular variações baseadas no horário
    hour_factor = 1 + (current_time.hour - 12) * 0.02  # Variação baseada na hora
    day_factor = 1 + random.uniform(-0.1, 0.1)  # Variação aleatória diária
    
    turbines_data = []
    
    for turbine_id, base_data in TURBINES_BASE_DATA.items():
        # Aplicar variações pequenas aos dados base
        current_failures = max(0, int(base_data['base_failures'] * day_factor))
        current_mttr = max(0.1, base_data['base_mttr'] * hour_factor)
        current_availability = min(99.9, max(0.1, base_data['base_availability'] * (2 - day_factor)))
        
        # Status atual da turbina
        status = 'operational'
        if current_availability < 50:
            status = 'critical'
        elif current_availability < 90:
            status = 'warning'
        
        turbine_data = {
            'id': turbine_id,
            'name': turbine_id,
            'failures': current_failures,
            'mttr': round(current_mttr, 2),
            'availability': round(current_availability, 2),
            'criticality': base_data['criticality'],
            'status': status,
            'last_update': current_time.isoformat(),
            'power_output': round(random.uniform(1.8, 2.2), 2),  # MW
            'wind_speed': round(random.uniform(8, 15), 1),  # m/s
            'temperature': round(random.uniform(20, 35), 1)  # °C
        }
        
        turbines_data.append(turbine_data)
    
    return turbines_data

@turbine_bp.route('/turbines/realtime', methods=['GET'])
def get_realtime_data():
    """Endpoint para dados em tempo real das turbinas"""
    try:
        data = generate_real_time_data()
        
        # Calcular KPIs gerais
        total_failures = sum(t['failures'] for t in data)
        avg_availability = sum(t['availability'] for t in data) / len(data)
        critical_turbines = [t['name'] for t in data if t['status'] == 'critical']
        
        response = {
            'timestamp': datetime.datetime.now().isoformat(),
            'turbines': data,
            'kpis': {
                'total_failures': total_failures,
                'avg_availability': round(avg_availability, 2),
                'critical_turbines': critical_turbines,
                'operational_turbines': len([t for t in data if t['status'] == 'operational']),
                'total_power_output': round(sum(t['power_output'] for t in data), 2)
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@turbine_bp.route('/turbines/<turbine_id>/history', methods=['GET'])
def get_turbine_history(turbine_id):
    """Endpoint para histórico de uma turbina específica"""
    try:
        if turbine_id not in TURBINES_BASE_DATA:
            return jsonify({'error': 'Turbina não encontrada'}), 404
        
        # Gerar histórico simulado das últimas 24 horas
        history = []
        current_time = datetime.datetime.now()
        
        for i in range(24):
            timestamp = current_time - datetime.timedelta(hours=i)
            base_data = TURBINES_BASE_DATA[turbine_id]
            
            # Variação temporal
            time_factor = 1 + random.uniform(-0.15, 0.15)
            
            history_point = {
                'timestamp': timestamp.isoformat(),
                'availability': round(base_data['base_availability'] * time_factor, 2),
                'power_output': round(random.uniform(1.5, 2.5), 2),
                'wind_speed': round(random.uniform(6, 18), 1),
                'temperature': round(random.uniform(18, 38), 1),
                'failures_count': max(0, int(base_data['base_failures'] * time_factor / 24))
            }
            
            history.append(history_point)
        
        return jsonify({
            'turbine_id': turbine_id,
            'history': list(reversed(history))  # Ordem cronológica
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@turbine_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Endpoint para alertas ativos"""
    try:
        current_data = generate_real_time_data()
        alerts = []
        
        for turbine in current_data:
            if turbine['status'] == 'critical':
                alerts.append({
                    'id': f"alert_{turbine['id']}_{int(time.time())}",
                    'turbine_id': turbine['id'],
                    'type': 'critical',
                    'message': f"Turbina {turbine['id']} com disponibilidade crítica: {turbine['availability']}%",
                    'timestamp': datetime.datetime.now().isoformat(),
                    'priority': 'high'
                })
            elif turbine['availability'] < 95:
                alerts.append({
                    'id': f"alert_{turbine['id']}_{int(time.time())}",
                    'turbine_id': turbine['id'],
                    'type': 'warning',
                    'message': f"Turbina {turbine['id']} com disponibilidade baixa: {turbine['availability']}%",
                    'timestamp': datetime.datetime.now().isoformat(),
                    'priority': 'medium'
                })
        
        return jsonify({
            'alerts': alerts,
            'total_alerts': len(alerts),
            'critical_alerts': len([a for a in alerts if a['type'] == 'critical'])
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@turbine_bp.route('/predictions', methods=['GET'])
def get_predictions():
    """Endpoint para previsões de manutenção"""
    try:
        predictions = []
        
        for turbine_id, base_data in TURBINES_BASE_DATA.items():
            # Simular previsão baseada nos dados históricos
            failure_probability = random.uniform(0.1, 0.9)
            days_to_failure = random.randint(5, 30)
            
            if base_data['criticality'] == 'alta':
                failure_probability *= 1.5
                days_to_failure = max(1, days_to_failure // 2)
            
            prediction = {
                'turbine_id': turbine_id,
                'failure_probability': round(min(1.0, failure_probability), 3),
                'estimated_days_to_failure': days_to_failure,
                'recommended_action': 'preventive_maintenance' if failure_probability > 0.7 else 'monitor',
                'confidence': round(random.uniform(0.7, 0.95), 2),
                'prediction_date': datetime.datetime.now().isoformat()
            }
            
            predictions.append(prediction)
        
        return jsonify({
            'predictions': predictions,
            'model_version': '1.0.0',
            'last_training': '2025-06-15T10:00:00'
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

