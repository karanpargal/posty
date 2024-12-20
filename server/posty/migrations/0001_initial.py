# Generated by Django 4.1.5 on 2023-01-17 10:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Template',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('maxCharacters', models.IntegerField()),
                ('font', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Template_format',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('format', models.CharField(max_length=9)),
                ('template', models.ManyToManyField(to='posty.template')),
            ],
        ),
        migrations.CreateModel(
            name='Template_color',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('color', models.CharField(max_length=30)),
                ('imageURL', models.CharField(max_length=200)),
                ('format', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posty.template_format')),
                ('template', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='posty.template')),
            ],
        ),
    ]
