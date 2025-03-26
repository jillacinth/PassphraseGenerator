#!/bin/bash
#SBATCH --job-name=inferenceJob # Job name
#SBATCH --output=%x.%j.out      # %x = Job Name, %j = Job ID
#SBATCH --error=%x.%j.err       # Error file
#SBATCH --partition=gpu         # Request GPU partition
#SBATCH --qos=standard          # Standard QoS
#SBATCH --account=fh224         # Replace PI_ucid with your PI's UCID
#SBATCH --nodes=1               # Request 1 node
#SBATCH --ntasks-per-node=1     # 1 task per node
#SBATCH --gres=gpu:4            # Request 4 GPU
#SBATCH --time=00:59:00         # 59 minutes max
#SBATCH --mem=64G

# --mem-per-cpu=64000M     # 4GB RAM per CPU

# Load Miniforge3
module load Miniforge3

#set default dirs
export CONDA_ENV_PATH="/project/fh224/pk577/GPUENV"
export CONDA_PKGS_DIRS="/project/fh224/pk577/conda_pkgs"
export CONDA_ENVS_DIRS="/project/fh224/pk577/conda_envs"
export HF_HOME="/project/fh224/pk577/huggingface"

# Initialize Conda (prevents potential activation issues)
source $(conda info --base)/etc/profile.d/conda.sh

# Set Conda environment path
CONDA_ENV_PATH="/project/fh224/pk577/GPUENV"

# Check if the environment exists, if not, create it
if [ ! -d "$CONDA_ENV_PATH" ]; then
    conda create -y --prefix "$CONDA_ENV_PATH" python=3.11
fi

# Activate the Conda environment
conda activate "$CONDA_ENV_PATH"

# Ensure necessary packages are installed
conda install -y -c conda-forge pytorch torchvision torchaudio transformers accelerate


# Run the Python script
echo "Starting inference"
python serverRun.py
echo "Job completed. Output is stored in /projects/fh224/pk577/questions.txt"
