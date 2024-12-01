import express from 'express';
import {
  getAllFriends,
  createFriend,
  updateFriend,
  deleteFriend
} from '../controllers/friendController.js';

const router = express.Router();

router.get('/', getAllFriends);
router.post('/', createFriend);
router.put('/:id', updateFriend);
router.delete('/:id', deleteFriend);

export default router;