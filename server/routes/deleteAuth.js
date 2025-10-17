import { Router } from 'express';
import supabaseAdmin from '../db/supabaseAdmin.js';

const router = Router();

router.post('/delete-user', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id required' });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (error) {
      console.error('Supabase deleteUser error:', error);
      return res.status(500).json({ error: error.message, details: error });
    }
    return res.json({ ok: true, data });
  } catch (err) {
    console.error('Unexpected error in delete-user route:', err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;