import json
from django.core.management.base import BaseCommand
from conversations.models import VirtualPatient

class Command(BaseCommand):
    help = '從JSON文件載入虛擬病人數據'

    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, required=True, help='虛擬病人名稱')
        parser.add_argument('--description', type=str, required=True, help='虛擬病人描述')
        parser.add_argument('--dialog', type=str, required=True, help='對話JSON文件路徑')
        parser.add_argument('--scoring', type=str, required=True, help='評分JSON文件路徑')

    def handle(self, *args, **kwargs):
        name = kwargs['name']
        description = kwargs['description']
        dialog_path = kwargs['dialog']
        scoring_path = kwargs['scoring']
        
        try:
            with open(dialog_path, 'r', encoding='utf-8') as f:
                dialog_json = json.load(f)
            
            with open(scoring_path, 'r', encoding='utf-8') as f:
                scoring_json = json.load(f)
            
            patient, created = VirtualPatient.objects.update_or_create(
                name=name,
                defaults={
                    'description': description,
                    'dialog_json': dialog_json,
                    'scoring_json': scoring_json
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'成功創建虛擬病人 "{name}"'))
            else:
                self.stdout.write(self.style.SUCCESS(f'成功更新虛擬病人 "{name}"'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'錯誤: {str(e)}'))