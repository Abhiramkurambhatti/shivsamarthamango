from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_alter_enquiry_options_enquiry_notes_enquiry_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='available_units',
            field=models.JSONField(blank=True, default=list, help_text='List of allowed units, e.g. ["box","dozen","kg","500g","grams"]'),
        ),
        migrations.AddField(
            model_name='product',
            name='unit_prices',
            field=models.JSONField(blank=True, default=dict, help_text='Per-unit pricing, e.g. {"dozen": 2400, "grams": 600}'),
        ),
        migrations.AlterField(
            model_name='product',
            name='image_url',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
