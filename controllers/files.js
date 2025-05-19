const User = require('../models/users');
const File = require('../models/files');
const fupQueue = require('../config/redis');

const uploadFile = async (req, res) => {
  try {
    const newFile = await File.create({
      userId: req.user.id,
      originalFilename: req.file.originalname,
      storagePath: req.file.path,
      title: req.body.title,
      description: req.body.description,
    });
    const job = await fupQueue.add('process-file', {
      title: req.body.title,
      description: req.body.description,
      file: req.file,
      fileId: newFile.id
    });
    console.log(job);
    return res.status(201).json({message: "File uploaded successfully.", fileId: newFile.id})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

const getFile = async (req, res) => {
  try {
    const { id:userId } = req.user;
    const { fileId } = req.params;
    const file = await File.findOne({where: {userId, id: fileId}, raw: true});

    if (file) {
      return res.status(200).json({ message: "Files fetched succcessfully", data: file });
    }

    return res.status(400).json({ message: "Invalid fileId or file not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch file contents' });
  }
};

const getFilesForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await File.findAll({where: {userId}, raw: true});
    res.status(200).json({ message: "Files fetched succcessfully", data: files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
};

module.exports = {
  uploadFile,
  getFile,
  getFilesForUser
}