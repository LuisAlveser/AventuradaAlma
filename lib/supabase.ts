
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PROJETOURL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.APIKEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);