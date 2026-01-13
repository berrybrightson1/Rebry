import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'submissions.json');

export interface Submission {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    projectType: string;
    budget: string;
    description: string;
    timeline?: string;
    status: 'New' | 'Contacted' | 'Completed';
    date: string;
}

export async function getSubmissions(): Promise<Submission[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveSubmission(submission: Omit<Submission, 'id' | 'date' | 'status'>) {
    const submissions = await getSubmissions();
    const newSubmission: Submission = {
        ...submission,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        status: 'New',
    };

    // Add to beginning
    submissions.unshift(newSubmission);

    // Ensure directory exists
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    } catch (e) { }

    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
    return newSubmission;
}

export async function updateSubmissionStatus(id: string, status: Submission['status']) {
    const submissions = await getSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
        submissions[index].status = status;
        await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
        return true;
    }
    return false;
}

export async function deleteSubmission(id: string) {
    const submissions = await getSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    if (filtered.length !== submissions.length) {
        await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
        return true;
    }
    return false;
}
