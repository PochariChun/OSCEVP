#!/bin/bash

# 設置 Python 路徑
export PYTHONPATH=$PYTHONPATH:$(pwd)

# 運行所有測試
pytest

# 或者運行特定測試
# pytest tests/accounts/
# pytest tests/conversations/ 