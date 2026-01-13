'use server'

import { saveSubmission, getSubmissions } from "@/lib/storage";

export async function submitProjectRequest(formData: any) {
    try {
        await saveSubmission(formData);
        return { success: true };
    } catch (error) {
        console.error('Failed to save submission:', error);
        return { success: false, error: 'Failed to save submission' };
    }
}

export async function getSubmissionsAction() {
    try {
        const data = await getSubmissions();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch submissions:', error);
        return { success: false, data: [] };
    }
}

export async function deleteSubmissionAction(id: string) {
    const { deleteSubmission } = await import("@/lib/storage");
    try {
        const success = await deleteSubmission(id);
        return { success };
    } catch (error) {
        console.error('Failed to delete submission:', error);
        return { success: false };
    }
}

export async function updateSubmissionStatusAction(id: string, status: any) {
    const { updateSubmissionStatus } = await import("@/lib/storage");
    try {
        const success = await updateSubmissionStatus(id, status);
        return { success };
    } catch (error) {
        console.error('Failed to update submission status:', error);
        return { success: false };
    }
}
