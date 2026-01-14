'use server'

import { supabase } from "@/utils/supabase/client";

// Supabase Request Interface
export interface RequestData {
    id: string;
    created_at: string;
    business_name: string;
    service_type: string;
    budget: string;
    whatsapp: string;
    email: string;
    description: string;
    status: 'New' | 'Contacted' | 'Completed';
}

export async function submitProjectRequest(formData: any) {
    try {
        const { error } = await supabase
            .from('requests')
            .insert({
                business_name: formData.name,
                service_type: formData.projectType,
                budget: formData.budget,
                whatsapp: formData.whatsapp,
                email: formData.email,
                description: formData.description,
                status: 'New'
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Failed to save submission:', error);
        return { success: false, error: 'Failed to save submission' };
    }
}

export async function getSubmissionsAction() {
    try {
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map Supabase data to frontend format
        const formattedData = (data as RequestData[]).map(doc => ({
            id: doc.id,
            name: doc.business_name || "Unknown",
            businessName: doc.business_name,
            email: doc.email,
            whatsapp: doc.whatsapp,
            projectType: doc.service_type,
            serviceType: doc.service_type,
            budget: doc.budget,
            description: doc.description,
            status: doc.status || 'New',
            createdAt: doc.created_at,
            date: new Date(doc.created_at).toLocaleDateString(),
        }));

        return { success: true, data: formattedData };
    } catch (error) {
        console.error('Failed to fetch submissions:', error);
        return { success: false, data: [] };
    }
}

export async function deleteSubmissionAction(id: string) {
    try {
        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Failed to delete submission:', error);
        return { success: false };
    }
}

export async function updateSubmissionStatusAction(id: string, status: any) {
    try {
        const { error } = await supabase
            .from('requests')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Failed to update submission status:', error);
        return { success: false };
    }
}
