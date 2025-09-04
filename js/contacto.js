class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.formContainer = document.getElementById('formContainer');
        this.successMessage = document.getElementById('successMessage');
        this.submitBtn = document.getElementById('submitBtn');

        this.fields = {
            nombre: {
                input: document.getElementById('nombre'),
                error: document.getElementById('nombreError'),
                validate: (value) => value.trim().length >= 2
            },
            email: {
                input: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            },
            mensaje: {
                input: document.getElementById('mensaje'),
                error: document.getElementById('mensajeError'),
                validate: (value) => value.trim().length >= 10
            }
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupFieldValidation();
    }

    setupFieldValidation() {
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.input.addEventListener('blur', () => this.validateField(fieldName));
            field.input.addEventListener('input', () => this.clearFieldError(fieldName));
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.input.value;
        const isValid = field.validate(value);

        if (!isValid) {
            this.showFieldError(fieldName);
            return false;
        } else {
            this.clearFieldError(fieldName);
            return true;
        }
    }

    showFieldError(fieldName) {
        const field = this.fields[fieldName];
        field.input.classList.add('input-error');
        field.error.classList.add('show');
    }

    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        field.input.classList.remove('input-error');
        field.error.classList.remove('show');
    }

    validateAllFields() {
        let isValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateAllFields()) {
            return;
        }

        this.setLoading(true);

        // Simular envío del formulario
        try {
            await this.simulateSubmission();
            this.showSuccess();
        } catch (error) {
            console.error('Error al enviar:', error);
            this.setLoading(false);
        }
    }

    async simulateSubmission() {
        // Simular delay de red
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showSuccess() {
        // Ocultar formulario con animación
        this.formContainer.classList.add('hidden');

        // Mostrar mensaje de éxito
        setTimeout(() => {
            this.successMessage.classList.add('show');
        }, 300);

        // Resetear formulario
        this.form.reset();
        Object.keys(this.fields).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }
}

// Inicializar el formulario cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});