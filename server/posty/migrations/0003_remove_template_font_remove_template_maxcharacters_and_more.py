# Generated by Django 4.1.5 on 2023-01-17 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posty', '0002_rename_id_template_template_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='template',
            name='font',
        ),
        migrations.RemoveField(
            model_name='template',
            name='maxCharacters',
        ),
        migrations.AddField(
            model_name='template_color',
            name='fontColorBody',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_color',
            name='fontColorCTA',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_color',
            name='fontColorPunchline',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontBody',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontCTA',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontPunchline',
            field=models.CharField(default=0, max_length=30),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontSizeBody',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontSizeCTA',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='fontSizePunchline',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='maxCharactersBody',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='maxCharactersCTA',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='template_format',
            name='maxCharactersPunchline',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]