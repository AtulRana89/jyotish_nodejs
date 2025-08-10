// routes/astrologer.routes.ts
import { Router } from 'express';
import { addAstrologer, deleteAstrologer, getAstrologers, updateAstrologer } from '../controllers/astrologer';


const astrologerRoutes = Router();

astrologerRoutes.post('/', addAstrologer);
astrologerRoutes.get('/', getAstrologers);
astrologerRoutes.put('/:id', updateAstrologer);
astrologerRoutes.delete('/:id', deleteAstrologer);

export default astrologerRoutes;
