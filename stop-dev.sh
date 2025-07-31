#!/bin/bash

SESSION_NAME="dev_env"

if tmux has-session -t $SESSION_NAME 2>/dev/null; then
  tmux kill-session -t $SESSION_NAME
  echo "Stopped tmux session '$SESSION_NAME'."
else
  echo "No tmux session named '$SESSION_NAME' found."
fi

