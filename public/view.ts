import DiaryController from "../controller/DiaryController.js";
import { Diaries } from "../shared/diaryInterface.js";

export async function displayList(): Promise<void> {
	try {
		const diaryEntries: Diaries[] = await DiaryController.getDiaries();
		const listContainer = document.getElementById('diary-list');
		if (listContainer) {
			listContainer.innerHTML = '';
			showDiaryItem(diaryEntries, listContainer, 0);
		}
	} catch (error) {
		console.error('Error getting diaries', error);
	}
}

export async function handleAdd() {
	try {
		const titleElement = document.getElementById('date') as HTMLInputElement;
		const contentElement = document.getElementById('content') as HTMLTextAreaElement;
		if (!contentElement.value) {
			alert('Fill the content');
			return;
		}
		const now = new Date();
		const title = titleElement.textContent || `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
		const newDiary = await DiaryController.createDiary(title, contentElement.value);
		if (!newDiary) {
			throw new Error('No diary added');
		}
		titleElement.value = '';
		contentElement.value = '';
		await displayList();
	}
	catch (error) {
		console.error('Error adding diary entry', error);
	}
}

async function handleRemove(id: number): Promise<void> {
	try {
		if (!confirm('Are you sure you want to remove this?'))
			return;
		const isRemoved = await DiaryController.deleteDiary(id)
		if (!isRemoved) {
			new Error('Diary not found');
		}
		await displayList();
	} catch (error) {
		console.error('Error removing the diary.', error);
	}
}

async function handleUpdate(id: number): Promise<void> {
	try {
		const diary = await DiaryController.getDiaryById(id);
		document.querySelector('.list-container')?.classList.add('hidden');
		document.querySelector('.modal-container')?.classList.remove('hidden');
		document.querySelector('.save-button')?.classList.remove('hidden');;
		document.querySelector('.add-button')?.classList.add('hidden');
		const titleElement = document.getElementById('date') as HTMLInputElement;
		const contentElement = document.getElementById('content') as HTMLTextAreaElement;
		contentElement.value = 'ahoana tsara';
		console.log(contentElement.value);


		if (diary && titleElement && contentElement) {
			titleElement.textContent = diary.title;
			contentElement.value = diary.content;
		}

		const saveButton = document.getElementById('save');
		if (saveButton) {
			saveButton.addEventListener('click', async () => {
				const titleElement = document.getElementById('date') as HTMLInputElement;
				const contentElement = document.getElementById('content') as HTMLTextAreaElement;;
				if (!contentElement.value) {
					alert('Fill the content');
					return;
				}
				const now = new Date();
				const title = titleElement.textContent || `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
				const updatedDiary = await DiaryController.updateDiary(id, title, contentElement.value);
				if (!updatedDiary) {
					throw new Error('No diary updated');
				}
				document.querySelector('.list-container')?.classList.remove('hidden');
				document.querySelector('.modal-container')?.classList.add('hidden');
				titleElement.value = '';
				contentElement.value = '';
				await displayList();
			});
		}
	} catch (error) {
		console.error('Error updating diary entry:', error);
	}
}

function showDiaryItem(entries: Diaries[], container: HTMLElement, i: number): void {
	try {
		if (i >= entries.length) return;

		const entry = entries[i];
		const entryElement = document.createElement('div');
		entryElement.className = 'diary-entry';
		entryElement.innerHTML = `
			<div class="item-diary">
				<h3>${entry.title}</h3>
				<p class="diary-content" id="diary-content-${entry.id}">${entry.content.substring(0, 100)}...</p>
				<button class="toggle-content item-button" id="toggle-content-${entry.id}" data-id="${entry.id}">Show More</button>
				<button class="update-entry item-button" id="update-entry-${entry.id}" data-id="${entry.id}">Update</button>
				<button class="delete-entry item-button" id="delete-entry-${entry.id}" data-id="${entry.id}">Delete</button>
			</div>		
			`;

		container.appendChild(entryElement);
		const contentElement = document.getElementById(`diary-content-${entry.id}`) as HTMLElement;
		const toggleButton = document.getElementById(`toggle-content-${entry.id}`) as HTMLButtonElement;
		toggleButton.addEventListener('click', () => {
			if (toggleButton.textContent === 'Show More') {
				contentElement.textContent = entry.content;
				toggleButton.textContent = 'Show Less';
			} else {
				contentElement.textContent = `${entry.content.substring(0, 100)}...`;
				toggleButton.textContent = 'Show More';
			}
		});

		const updateButton = entryElement.querySelector(`#update-entry-${entry.id}`) as HTMLButtonElement;
		updateButton.addEventListener('click', async () => await handleUpdate(entry.id));

		const deleteButton = entryElement.querySelector(`#delete-entry-${entry.id}`) as HTMLButtonElement;
		deleteButton.addEventListener('click', () => handleRemove(entry.id));
		showDiaryItem(entries, container, i + 1);
	}
	catch (error) {
		console.error('Error displaying diary entries', error);
	}
}