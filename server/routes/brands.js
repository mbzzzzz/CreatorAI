const express = require('express');
const Brand = require('../models/Brand');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all brands for user
router.get('/', auth, async (req, res) => {
  try {
    const brands = await Brand.find({ userId: req.userId, isActive: true })
      .sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single brand
router.get('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findOne({ 
      _id: req.params.id, 
      userId: req.userId, 
      isActive: true 
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    res.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new brand
router.post('/', auth, async (req, res) => {
  try {
    const brandData = {
      ...req.body,
      userId: req.userId
    };

    const brand = new Brand(brandData);
    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update brand
router.put('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete brand (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect social media account
router.post('/:id/connect/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { username, accessToken, refreshToken, pageId, channelId } = req.body;

    const updateData = {
      [`socialAccounts.${platform}.connected`]: true,
      [`socialAccounts.${platform}.username`]: username,
      [`socialAccounts.${platform}.accessToken`]: accessToken,
      [`socialAccounts.${platform}.refreshToken`]: refreshToken
    };

    if (pageId) updateData[`socialAccounts.${platform}.pageId`] = pageId;
    if (channelId) updateData[`socialAccounts.${platform}.channelId`] = channelId;

    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Error connecting social account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Disconnect social media account
router.delete('/:id/disconnect/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;

    const updateData = {
      [`socialAccounts.${platform}.connected`]: false,
      [`socialAccounts.${platform}.username`]: null,
      [`socialAccounts.${platform}.accessToken`]: null,
      [`socialAccounts.${platform}.refreshToken`]: null,
      [`socialAccounts.${platform}.pageId`]: null,
      [`socialAccounts.${platform}.channelId`]: null
    };

    const brand = await Brand.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;