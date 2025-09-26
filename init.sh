#!/bin/zsh

# Colors for output
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to create .env file from a link
create_env_from_link() {
  local link="https://www.notion.so/Bitrock-Center-1cb75833085d80e3b914dbc329e4170c"
  local env_file=".env"

  # Create .env file if it doesn't exist
  if [ ! -f "$env_file" ]; then
    touch "$env_file"
    echo ".env file created."
  else
    echo ".env file already exists."
  fi

  echo "${YELLOW}A browser window will open to get the necessary environment variables."
  echo "Press Enter to continue...${NC}"
  read

  # Open the link in the default browser
  if command -v open >/dev/null 2>&1; then
    open "$link"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$link"
  else
    echo "Please open the following link manually: $link"
  fi

  echo "Please copy the contents from the opened link and paste them into the .env file."
  echo "Press Enter when you have finished editing the .env file."
  read
}

check_dependencies() {
  echo "Checking for required dependencies..."
  missing=()

  # Check Node.js
  if ! command -v node >/dev/null 2>&1; then
    missing+=("Node.js")
  fi

  # Check Docker
  if ! command -v docker >/dev/null 2>&1; then
    missing+=("Docker")
  fi

  # Check Yarn
  if ! command -v yarn >/dev/null 2>&1; then
    missing+=("Yarn")
  fi

  # Load NVM if installed
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
  fi

  # Check NVM
  if ! command -v nvm >/dev/null 2>&1; then
    missing+=("nvm")
  fi

  if [ ${#missing[@]} -eq 0 ]; then
    echo "All dependencies are installed."
  else
    echo "The following dependencies are missing:"
    for dep in "${missing[@]}"; do
        echo "  - $dep"
    done
      echo "Please install the missing dependencies manually before proceeding."
    exit 1
  fi
}

# Function to repeatedly check for required environment variables until all are present
check_env_vars() {
  local env_file=".env"
  local required_vars=(
    'NEXT_PUBLIC_SUPABASE_URL'
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    'SUPABASE_SECRET_KEY'
    'NEXT_PUBLIC_REDIRECT_URL'
    'DATABASE_URL'
    'GEMINI_API_KEY'
    'WEBSITE_URL'
    'SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID'
    'SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET'
    'SUPABASE_AUTH_EXTERNAL_GOOGLE_REDIRECT_URI'
  )

  while true; do
    if [ ! -f "$env_file" ]; then
      echo ".env file not found. Please create it."
      echo "Press Enter after creating the .env file..."
      read
      continue
    fi

    local all_present=true
    for var in "${required_vars[@]}"; do
      if ! grep -q "^$var=" "$env_file"; then
        echo "The following environment variable is missing in $env_file:"
        echo "  - $var"
        echo "Please add this variable to $env_file."
        echo "Press Enter after updating the .env file..."
        read
        all_present=false
        break
      fi
    done

    if [ "$all_present" = true ]; then
      echo "All required environment variables are present in $env_file."
      break
    fi
  done
}

# Function to install and setup supabase, then update .env with anon and service_role keys
setup_supabase() {
  local env_file=".env"

  # Check if supabase CLI is installed
  if ! command -v supabase >/dev/null 2>&1; then
    echo "Supabase CLI not found. Installing globally with npm..."
    npm install -g supabase
  fi

  echo "\n--- Supabase Login ---"
  supabase login

  echo "\n--- Supabase Link ---"
  supabase link

  echo "\n--- Supabase Start ---"
  # Capture output of supabase start
  SUPABASE_START_OUTPUT=$(supabase start 2>&1)
  echo "$SUPABASE_START_OUTPUT"

  # Extract anon and service_role keys from output
  ANON_KEY=$(echo "$SUPABASE_START_OUTPUT" | grep -Eo 'anon\s*:\s*"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')
  SERVICE_ROLE_KEY=$(echo "$SUPABASE_START_OUTPUT" | grep -Eo 'service_role\s*:\s*"[^"]+"' | head -1 | sed -E 's/.*"([^"]+)".*/\1/')

  if [ -n "$ANON_KEY" ]; then
    if grep -q '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' "$env_file"; then
      sed -i '' "s|^NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=\"$ANON_KEY\"|" "$env_file"
    else
      echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=\"$ANON_KEY\"" >> "$env_file"
    fi
    echo "Set NEXT_PUBLIC_SUPABASE_ANON_KEY in $env_file."
  else
    echo "Could not find anon key in supabase start output."
  fi

  if [ -n "$SERVICE_ROLE_KEY" ]; then
    if grep -q '^SUPABASE_SECRET_KEY=' "$env_file"; then
      sed -i '' "s|^SUPABASE_SECRET_KEY=.*|SUPABASE_SECRET_KEY=\"$SERVICE_ROLE_KEY\"|" "$env_file"
    else
      echo "SUPABASE_SECRET_KEY=\"$SERVICE_ROLE_KEY\"" >> "$env_file"
    fi
    echo "Set SUPABASE_SECRET_KEY in $env_file."
  else
    echo "Could not find service_role key in supabase start output."
  fi
}

# Main script execution
check_dependencies
create_env_from_link
check_env_vars
setup_supabase
