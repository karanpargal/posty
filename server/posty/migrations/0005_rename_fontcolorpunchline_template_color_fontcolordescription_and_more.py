# Generated by Django 4.1.5 on 2023-01-21 09:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posty', '0004_rename_imageurl_template_color_templates3url_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='template_color',
            old_name='fontColorPunchline',
            new_name='fontColorDescription',
        ),
        migrations.RenameField(
            model_name='template_format',
            old_name='fontPunchline',
            new_name='fontDescription',
        ),
        migrations.RenameField(
            model_name='template_format',
            old_name='fontSizePunchline',
            new_name='fontSizeDescription',
        ),
        migrations.RenameField(
            model_name='template_format',
            old_name='maxCharactersPunchline',
            new_name='maxCharactersDescription',
        ),
    ]