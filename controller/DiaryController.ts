import DiaryModel from "../model/DiaryModel.js";
import { Diaries } from "../shared/diaryInterface.js";

// The controller which receives the data and interacts with the model
class DiaryController {

	// Have the new diary and pass it to the model
	public static async createDiary(title: string, content: string): Promise<Diaries> {
		const newDiary: Diaries = {
			id: Date.now(),
			title,
			content,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await DiaryModel.saveDiary(newDiary);
		return newDiary;
	}

	// get all diaries
	public static async getDiaries(): Promise<Diaries[]> {
		return DiaryModel.getAllDiaries();
	}

	// get a diary by id
	public static async getDiaryById(id: number): Promise<Diaries | undefined> {
		const diaries = await DiaryModel.getAllDiaries();
		for (let diary of diaries) {
			if (diary.id === id) {
				return diary;
			}
		}
		return undefined;
	}

	// update the diary
	public static async updateDiary(id: number, title?: string, content?: string): Promise<Diaries | undefined> {
		const diary = await this.getDiaryById(id);
		if (diary) {
			if (title) diary.title = title;
			if (content) diary.content = content;
			diary.updatedAt = new Date();
			await DiaryModel.updateDiary(diary);
			return diary;
		}
		return undefined;
	}

	// delete the diary
	public static async deleteDiary(id: number): Promise<boolean> {
		const diary = await this.getDiaryById(id);
		if (diary) {
			await DiaryModel.deleteDiary(id);
			return true;
		}
		return false;
	}
}

export default DiaryController;
