# backend/dashboard.py
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px

# Jeu de données fictif pour le dashboard
df = pd.DataFrame({
    "Mois": ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    "Patients": [50, 60, 55, 70, 65, 80]
})

# Initialisation de l'application Dash
app = dash.Dash(__name__)
app.layout = html.Div(children=[
    html.H1(children='Dashboard BI - Néphrologie'),
    dcc.Graph(
        id='graph-patients',
        figure=px.line(df, x="Mois", y="Patients", title="Nombre de Patients par Mois")
    )
])

if __name__ == '__main__':
    app.run_server(debug=True, port=8050)
