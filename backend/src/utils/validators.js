import { check } from 'express-validator';

export const registerValidation = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please include a valid email'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
    check('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please include a valid email'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];

export const campaignValidation = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('targetPoints')
        .isNumeric()
        .withMessage('Target points must be a number')
        .custom(value => value > 0)
        .withMessage('Target points must be greater than 0'),
    check('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    check('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
        .withMessage('End date must be after start date')
];

export const communityValidation = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot be more than 50 characters'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('category')
        .isIn(['environment', 'education', 'health', 'community', 'technology', 'other'])
        .withMessage('Invalid category')
];

export const rewardValidation = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 50 })
        .withMessage('Title cannot be more than 50 characters'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('pointsCost')
        .isNumeric()
        .withMessage('Points cost must be a number')
        .custom(value => value > 0)
        .withMessage('Points cost must be greater than 0'),
    check('quantity')
        .isNumeric()
        .withMessage('Quantity must be a number')
        .custom(value => value > 0)
        .withMessage('Quantity must be greater than 0')
];

export const achievementValidation = [
    check('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 50 })
        .withMessage('Title cannot be more than 50 characters'),
    check('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    check('pointsValue')
        .isNumeric()
        .withMessage('Points value must be a number')
        .custom(value => value > 0)
        .withMessage('Points value must be greater than 0'),
    check('criteria.type')
        .isIn(['campaignsCompleted', 'pointsEarned', 'communitiesJoined', 'rewardsClaimed', 'special'])
        .withMessage('Invalid criteria type'),
    check('criteria.value')
        .isNumeric()
        .withMessage('Criteria value must be a number')
        .custom(value => value > 0)
        .withMessage('Criteria value must be greater than 0')
];
