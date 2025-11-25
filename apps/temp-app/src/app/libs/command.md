# Create a new Angular workspace + initial app

ng new my-app

# Navigate into project folder

cd my-app

# Run the app locally (default: http://localhost:4200)

ng serve

# Generate a new component

ng generate component component-name

# or shorthand:

ng g c component-name

# Generate component in a subfolder

ng g c folder/component-name

# Generate component without spec file

ng g c component-name --skip-tests

# Inline template and styles

ng g c component-name --inline-template --inline-style

# Generate a service

ng generate service service-name

# or shorthand:

ng g s service-name

# Generate service in a folder

ng g s core/services/api

# Skip spec file

ng g s service-name --skip-tests

# Generate a directive

ng generate directive directive-name

# or shorthand:

ng g d directive-name
