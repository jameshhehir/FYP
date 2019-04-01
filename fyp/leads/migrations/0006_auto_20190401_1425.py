# Generated by Django 2.1.7 on 2019-04-01 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0005_auto_20190331_1428'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lead',
            name='email',
        ),
        migrations.AddField(
            model_name='lead',
            name='STLfile',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='lead',
            name='filename',
            field=models.CharField(max_length=100),
        ),
    ]
