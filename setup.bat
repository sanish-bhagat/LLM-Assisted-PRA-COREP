@echo off
echo Setting up PRA COREP Reporting Assistant with Conda...

REM Activate conda environment
call conda activate dl_env
if %errorlevel% neq 0 (
    echo Error: Could not activate conda environment 'dl_env'. 
    echo Please ensure it exists: conda create -n dl_env python=3.10
    exit /b %errorlevel%
)

REM Install dependencies
pip install -r backend/requirements.txt

REM Create .env if not exists
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend/.env from example. Please add your OPENAI_API_KEY.
)

echo Setup complete! To run the demo, set your OPENAI_API_KEY in backend/.env and run:
echo python demo.py
