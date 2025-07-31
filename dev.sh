#!/bin/bash

SESSION_NAME="dev_env"

# Check if the session already exists
tmux has-session -t $SESSION_NAME 2>/dev/null
if [ $? -eq 0 ]; then
  echo "Session '$SESSION_NAME' already exists. Attach with: tmux attach -t $SESSION_NAME"
  exit 1
fi

tmux new-session -d -s $SESSION_NAME

# Pane 0: tsc --watch
tmux send-keys -t $SESSION_NAME 'cd server && tsc --watch' C-m

# Pane 1: nodemon
tmux split-window -h -t $SESSION_NAME
tmux send-keys -t $SESSION_NAME 'cd server && nodemon --watch build/ build/startThisToStartTheGameServer.js' C-m

# Pane 2: webpack --watch
tmux split-window -v -t $SESSION_NAME:0.0
tmux send-keys -t $SESSION_NAME 'cd client && webpack --watch --mode development' C-m

# Pane 3: live-server
tmux split-window -v -t $SESSION_NAME:0.1
tmux send-keys -t $SESSION_NAME 'cd client && live-server public' C-m

tmux select-layout -t $SESSION_NAME tiled

echo "Dev environment started in tmux session '$SESSION_NAME'."
echo "Attach to it with: tmux attach -t $SESSION_NAME"

