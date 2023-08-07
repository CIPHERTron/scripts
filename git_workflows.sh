#!/bin/bash

# Function to clone a Git repository
clone_repository() {
    local repo_url="$1"
    local destination_dir="$2"

    git clone "$repo_url" "$destination_dir"
}

# Function to push changes to a Git repository
# push_changes() {
#     local repository_dir="$1"
#     local commit_message="$2"

#     cd "$repository_dir" || exit
#     git add .
#     git commit -m "$commit_message"
#     git push origin master  # Change 'master' to the desired branch if needed
# }

# Function to create a new branch in a Git repository
create_new_branch() {
    local repository_dir="$1"
    local branch_name="$2"

    cd "$repository_dir" || exit
    git checkout -b "$branch_name"
}

# Example usage:

# Clone a repository
clone_repository "https://github.com/<username>/<repo-name>.git" "destination_directory"

# Perform changes in the repository directory
# (modify files, add new files, etc.)

# Push changes to the repository
# push_changes "destination_directory" "Commit message explaining the changes"

# Create a new branch in the repository
create_new_branch "destination_directory" "new_feature_branch"

# replace with your own repo url in line 34
# chmod +x git_workflows.sh
# ./git_workflows.sh