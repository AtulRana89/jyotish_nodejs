// controllers/astrologer.controller.ts
import { Request, Response } from 'express';
import { IAstrologer } from '../types';
import Astrologer from '../models/Astrologer';

// ✅ Add Astrologer
export const addAstrologer = async (req: Request, res: Response) => {
  try {
    const astrologerData: IAstrologer = req.body;

    const astrologer = new Astrologer(astrologerData);
    await astrologer.save();

    res.status(201).json({
      success: true,
      message: 'Astrologer added successfully',
      data: astrologer,
    });
  } catch (error) {
    console.error('Error adding astrologer:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Get All Astrologers with Filters & Pagination
export const getAstrologers = async (req: Request, res: Response) => {
  try {
    const {
      limit = 10,
      page = 1,
      id,
      search,
    } = req.query as { limit?: string; page?: string; id?: string; search?: string };

    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const astrologers = await Astrologer.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Astrologer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: astrologers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching astrologers:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Update Astrologer
export const updateAstrologer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const astrologer = await Astrologer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Astrologer updated successfully',
      data: astrologer,
    });
  } catch (error) {
    console.error('Error updating astrologer:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ Delete Astrologer
export const deleteAstrologer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const astrologer = await Astrologer.findByIdAndDelete(id);

    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Astrologer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting astrologer:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
