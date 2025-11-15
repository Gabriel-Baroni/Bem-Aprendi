document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        
        // Encontra o input de senha (que é o elemento irmão anterior)
        const input = this.previousElementSibling;

        // Alterna o tipo do input
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);

        // Alterna o ícone (olho aberto / olho fechado)
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});