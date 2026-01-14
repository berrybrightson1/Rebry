"use server";

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProjectsAction() {
    try {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { success: false, error: "Failed to fetch projects" };
    }
}

// Updated to include gallery and project_url
export async function createProjectAction(projectData: { title: string, category: string, image_url: string, width: number, height: number, gallery?: string[], project_url?: string }) {
    try {
        const { data, error } = await supabase
            .from("projects")
            .insert([projectData])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function deleteProjectAction(id: string) {
    try {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, error: "Failed to delete project" };
    }
}
