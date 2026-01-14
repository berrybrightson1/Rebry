'use server'

import dbConnect from "@/lib/db";
import Request from "@/models/Request";

// Type definition to match frontend expectations
export interface AdminSubmission {
    id: string;
    businessName: string; // Mapped from businessName
    name: string; // Mapped from businessName for compatibility if needed, or update frontend
    email: string;
    whatsapp: string;
    serviceType: string; // Mapped from serviceType
    projectType: string; // Mapped from serviceType for compatibility
    budget: string;
    description: string;
    status: 'New' | 'Contacted' | 'Completed';
    createdAt: string;
    date: string; // Derived from createdAt
}

export async function submitProjectRequest(formData: any) {
    try {
        await dbConnect();
        // Ensure we save with the correct fields as per schema
        await Request.create({
            businessName: formData.name,
            serviceType: formData.projectType, // Map 'projectType' -> 'serviceType'
            budget: formData.budget,
            whatsapp: formData.whatsapp,
            email: formData.email,
            description: formData.description,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to save submission:', error);
        return { success: false, error: 'Failed to save submission' };
    }
}

export async function getSubmissionsAction() {
    try {
        await dbConnect();
        const docs = await Request.find({}).sort({ createdAt: -1 }).lean();

        const data = docs.map((doc: any) => ({
            id: doc._id.toString(),
            name: doc.businessName || "Unknown",
            businessName: doc.businessName,
            email: doc.email,
            whatsapp: doc.whatsapp,
            projectType: doc.serviceType,
            serviceType: doc.serviceType,
            budget: doc.budget,
            description: doc.description,
            status: doc.status || 'New',
            createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
            date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        }));

        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch submissions:', error);
        return { success: false, data: [] };
    }
}

export async function deleteSubmissionAction(id: string) {
    try {
        await dbConnect();
        await Request.findByIdAndDelete(id);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete submission:', error);
        return { success: false };
    }
}

export async function updateSubmissionStatusAction(id: string, status: any) {
    try {
        await dbConnect();
        await Request.findByIdAndUpdate(id, { status });
        return { success: true };
    } catch (error) {
        console.error('Failed to update submission status:', error);
        return { success: false };
    }
}
