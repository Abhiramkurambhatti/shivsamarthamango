from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_product_units'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='images',
            field=models.JSONField(blank=True, default=list, help_text='List of photo URLs for gallery slider'),
        ),
    ]
