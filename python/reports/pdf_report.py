#!/usr/bin/env python3
"""
PDF Report Generator for Reloj Laboral
Generates PDF reports with official format for labor inspections.
"""

import os
import sys
from datetime import datetime
from pathlib import Path

try:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch, mm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
        PageBreak, Image
    )
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    from reportlab.pdfgen import canvas
except ImportError:
    print("Installing required packages...")
    os.system("pip install reportlab")
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch, mm
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
        PageBreak, Image
    )
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    from reportlab.pdfgen import canvas


def create_header(canvas, title, company_name):
    """Create PDF header"""
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(50 * mm, 280 * mm, title)
    
    canvas.setFont("Helvetica", 10)
    canvas.drawString(50 * mm, 272 * mm, f"Empresa: {company_name}")
    canvas.drawString(50 * mm, 266 * mm, f"Fecha: {datetime.now().strftime('%d/%m/%Y')}")
    canvas.drawRightString(160 * mm, 272 * mm, "Página 1")
    
    canvas.line(50 * mm, 260 * mm, 160 * mm, 260 * mm)


def create_daily_report(data: list, output_path: str, company_name: str = "Empresa"):
    """Generate daily PDF report"""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    normal_style = styles['Normal']
    
    story.append(Paragraph("REGISTRO DE JORNADA LABORAL", title_style))
    story.append(Paragraph(f"Empresa: {company_name}", normal_style))
    story.append(Paragraph(f"Fecha: {datetime.now().strftime('%d/%m/%Y')}", normal_style))
    story.append(Spacer(1, 20))
    
    if data:
        table_data = [['Tipo', 'Hora', 'Dispositivo', 'Notas']]
        
        for clocking in data:
            clock_type = "Entrada" if clocking.get('type') == 'ENTRY' else "Salida"
            timestamp = clocking.get('timestamp', '')
            if timestamp:
                try:
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                    timestamp = dt.strftime('%H:%M')
                except:
                    pass
            device = clocking.get('deviceInfo', '-')
            notes = clocking.get('notes', '-')
            
            table_data.append([clock_type, timestamp, device, notes])
        
        table = Table(table_data, colWidths=[50 * mm, 30 * mm, 50 * mm, 30 * mm])
        
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0EA5E9')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])
        
        table.setStyle(table_style)
        story.append(table)
        
        story.append(Spacer(1, 30))
        
        working_hours = 0
        entry_time = None
        
        for clocking in data:
            if clocking.get('type') == 'ENTRY':
                try:
                    entry_time = datetime.fromisoformat(clocking.get('timestamp', '').replace('Z', '+00:00'))
                except:
                    pass
            elif clocking.get('type') == 'EXIT' and entry_time:
                try:
                    exit_time = datetime.fromisoformat(clocking.get('timestamp', '').replace('Z', '+00:00'))
                    working_hours += (exit_time - entry_time).total_seconds() / 3600
                    entry_time = None
                except:
                    pass
        
        story.append(Paragraph(f"<b>Horas trabajadas:</b> {working_hours:.2f}", normal_style))
    else:
        story.append(Paragraph("No hay registros de jornada para este período.", normal_style))
    
    story.append(Spacer(1, 40))
    
    signature_text = """
    <b>Firma del trabajador:</b> _________________________  <b>Fecha:</b> ____/____/____
    """
    story.append(Paragraph(signature_text, normal_style))
    
    story.append(Spacer(1, 20))
    
    legal_text = """
    <i>Este documento cumple con el artículo 34.9 del Estatuto de los Trabajadores 
    relativo al registro de jornada. Debe conservarse durante 4 años.</i>
    """
    story.append(Paragraph(legal_text, styles['Italic']))
    
    doc.build(story)
    print(f"Daily PDF report saved: {output_path}")


def create_monthly_report(data: dict, output_path: str, company_name: str = "Empresa"):
    """Generate monthly PDF report"""
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    month = data.get('month', '')
    year = data.get('year', '')
    
    story.append(Paragraph("REGISTRO DE JORNADA LABORAL - RESUMEN MENSUAL", title_style))
    story.append(Paragraph(f"Empresa: {company_name}", styles['Normal']))
    story.append(Paragraph(f"Período: {month}/{year}", styles['Normal']))
    story.append(Spacer(1, 20))
    
    if data and 'dailySummary' in data:
        table_data = [['Fecha', 'Horas']]
        
        daily_summary = data.get('dailySummary', {})
        
        for date, hours in sorted(daily_summary.items()):
            table_data.append([date, f"{hours:.2f}"])
        
        total_hours = sum(daily_summary.values())
        
        table_data.append(['TOTAL', f"{total_hours:.2f}"])
        
        table = Table(table_data, colWidths=[80 * mm, 40 * mm])
        
        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0EA5E9')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#E5E7EB')),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ])
        
        table.setStyle(table_style)
        story.append(table)
        
        story.append(Spacer(1, 30))
        
        story.append(Paragraph(f"<b>Total horas del mes:</b> {total_hours:.2f}", styles['Normal']))
        story.append(Paragraph(f"<b>Días trabajados:</b> {len(daily_summary)}", styles['Normal']))
    else:
        story.append(Paragraph("No hay registros para este período.", styles['Normal']))
    
    story.append(Spacer(1, 40))
    
    story.append(Paragraph("<b>Firma y sello:</b>", styles['Normal']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("_" * 40, styles['Normal']))
    story.append(Paragraph("Fecha: ____/____/____", styles['Normal']))
    
    doc.build(story)
    print(f"Monthly PDF report saved: {output_path}")


def main():
    """Main function for CLI usage"""
    import argparse
    import json
    
    parser = argparse.ArgumentParser(description="Generate PDF reports for Reloj Laboral")
    parser.add_argument('--type', choices=['daily', 'monthly'], required=True)
    parser.add_argument('--data', required=True, help='JSON data or path to JSON file')
    parser.add_argument('--output', required=True, help='Output file path')
    parser.add_argument('--company', default='Empresa', help='Company name')
    
    args = parser.parse_args()
    
    if os.path.isfile(args.data):
        with open(args.data, 'r') as f:
            data = json.load(f)
    else:
        data = json.loads(args.data)
    
    if args.type == 'daily':
        create_daily_report(data.get('clockings', []), args.output, args.company)
    elif args.type == 'monthly':
        create_monthly_report(data, args.output, args.company)


if __name__ == '__main__':
    main()