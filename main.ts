import { displayList, handleAdd } from './public/view.js';

window.onload = async () => {
    await displayList();
    // Add event listener for add button
    const addButton = document.getElementById('add');
    if (addButton) {
        addButton.addEventListener('click', () => {
            document.querySelector('.list-container')?.classList.add('hidden');
            document.querySelector('.modal-container')?.classList.remove('hidden');
            document.querySelector('.save-button')?.classList.add('hidden');;
            document.querySelector('.add-button')?.classList.remove('hidden');
        });
    }

    // Add event listener for back button
    const backButton = document.getElementById('back');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.querySelector('.list-container')?.classList.remove('hidden');
            document.querySelector('.modal-container')?.classList.add('hidden');
            const titleElement = document.getElementById('date');
            const contentElement = document.getElementById('content') as HTMLTextAreaElement;
            if (titleElement && contentElement) {
                titleElement.textContent = '';
                contentElement.value = '';
            }
        });
    }
    // Add the title as the date of today
    const dateElement = document.getElementById('date');
    if (dateElement) {
        const now = new Date();
        const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        dateElement.textContent = formattedDate;
    }

    // Add event listener for submit button for adding diary
    const submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
            await handleAdd();
            document.querySelector('.list-container')?.classList.remove('hidden');
            document.querySelector('.modal-container')?.classList.add('hidden');
        });
    }
};
