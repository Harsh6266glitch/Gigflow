import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Lead } from '../models/lead.model';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';
import { Parser } from 'json2csv';

interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      source,
      search,
      sort = 'latest',
    } = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: mongoose.FilterQuery<typeof Lead> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    sendSuccess(res, {
      leads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      return next(Object.assign(new Error('Lead not found'), { statusCode: 404 }) as AppError);
    }
    sendSuccess(res, lead);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user!._id,
    });
    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!lead) {
      return next(Object.assign(new Error('Lead not found'), { statusCode: 404 }) as AppError);
    }
    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return next(Object.assign(new Error('Lead not found'), { statusCode: 404 }) as AppError);
    }
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCSV = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQueryParams;

    const filter: mongoose.FilterQuery<typeof Lead> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    const fields = ['name', 'email', 'status', 'source', 'notes', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(
      leads.map((l) => ({
        name: l.name,
        email: l.email,
        status: l.status,
        source: l.source,
        notes: l.notes || '',
        createdAt: new Date(l.createdAt).toISOString(),
      }))
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="gigflow-leads.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [total, byStatus, bySource] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    const statusMap: Record<string, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };
    byStatus.forEach((item: { _id: string; count: number }) => {
      statusMap[item._id] = item.count;
    });

    const sourceMap: Record<string, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };
    bySource.forEach((item: { _id: string; count: number }) => {
      sourceMap[item._id] = item.count;
    });

    sendSuccess(res, {
      total,
      byStatus: statusMap,
      bySource: sourceMap,
    });
  } catch (error) {
    next(error);
  }
};
