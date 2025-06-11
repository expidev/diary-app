import { Diaries } from "../shared/diaryInterface.js";

// interact with the local storage, can be replaced with a database in the future
class DiaryModel {
	private static storageKey = 'diaries';

	// Get all diaries from local storage
	static async getAllDiaries(): Promise<Diaries[]> {
		const diaries = localStorage.getItem(this.storageKey);
		return diaries ? JSON.parse(diaries) : [];
	}

	// save diry to the local storage
	static async saveDiary(diary: Diaries): Promise<void> {
		const diaries = await this.getAllDiaries();
		diaries.push(diary);
		localStorage.setItem(this.storageKey, JSON.stringify(diaries));
	}

	// update diary in the local storage
	static async updateDiary(updatedDiary: Diaries): Promise<void> {
		const diaries = await this.getAllDiaries();
		const index = diaries.findIndex(diary => diary.id === updatedDiary.id);
		if (index !== -1) {
			diaries[index] = updatedDiary;
			localStorage.setItem(this.storageKey, JSON.stringify(diaries));
		}
	}

	// remove a diary from the local storage
	static async deleteDiary(id: number): Promise<void> {
		const diaries = await this.getAllDiaries();
		const filteredDiaries = diaries.filter(diary => diary.id !== id);
		localStorage.setItem(this.storageKey, JSON.stringify(filteredDiaries));
	}
}

export default DiaryModel;
