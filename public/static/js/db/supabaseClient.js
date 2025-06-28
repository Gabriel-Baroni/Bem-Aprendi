import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://cpfehiufjitmzyrjiopc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZmVoaXVmaml0bXp5cmppb3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNzE0NzYsImV4cCI6MjA2Mjc0NzQ3Nn0.JLs1f9S1qnkOyIw6b7CoKos_el8pHXIKi92WnK7-hd0';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;