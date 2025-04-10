class DialogGenerator:
    """虛擬病人對話生成器"""
    
    def __init__(self, dialog_json):
        self.dialog_data = dialog_json
        self.question_map = {item['question']: item for item in dialog_json}
        self.current_index = 0
    
    def get_response(self, user_input, vector_store=None):
        """根據用戶輸入獲取回應"""
        # 如果沒有向量存儲，則順序返回回應
        if not vector_store:
            if self.current_index < len(self.dialog_data):
                response = self.dialog_data[self.current_index]['answer']
                self.current_index += 1
                return response
            else:
                return "對話已結束。"
        
        # 使用向量檢索尋找最匹配的問題
        results = vector_store.search("dialog_questions", user_input, top_k=1)
        
        if not results or results[0]['score'] < 0.6:
            return "我不太明白您的意思，請換個方式提問。"
        
        best_match = results[0]
        matched_question = best_match['text']
        
        # 獲取匹配問題的回應
        if matched_question in self.question_map:
            return self.question_map[matched_question]['answer']
            
        return "抱歉，我不知道如何回答這個問題。"
    
    def reset(self):
        """重置對話狀態"""
        self.current_index = 0