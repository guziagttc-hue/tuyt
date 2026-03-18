import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nnsyfajryzhvtiopqwxa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uc3lmYWpyeXpodnRpb3Bxd3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzI4NDEsImV4cCI6MjA4ODYwODg0MX0.Txeb8egi_WBgxI4basEbI8IOkCYXekBMiqa7kCuPfQs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
