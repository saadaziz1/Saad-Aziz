const Project = require("../models/project.model");
const Member = require("../models/member.model");

// GET ALL PROJECTS
exports.getAllProjects = async (req,res)=>{
  try{
    const projects = await Project.find({ user: req.user._id }).populate("members");
    res.status(200).json({ success:true, message:"Projects fetched", data:projects });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// GET SINGLE PROJECT
exports.getProjectById = async (req,res)=>{
  try{
    const project = await Project.findOne({ _id:req.params.id, user:req.user._id }).populate("members");
    if(!project) return res.status(404).json({ success:false, message:"Project not found" });
    res.status(200).json({ success:true, data:project });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// CREATE PROJECT
exports.createProject = async (req,res)=>{
  try{
    let { title, description, techStack, status, members } = req.body;

    // remove duplicates
    members = [...new Set((members||[]).map(String))];

    // validate members exist
    if(members.length > 0){
      const validMembers = await Member.find({ _id: { $in: members } });
      if(validMembers.length !== members.length){
        return res.status(400).json({ success:false, message:"Some members do not exist" });
      }
    }

    const project = await Project.create({ title, description, techStack, status, members, user:req.user._id });
    res.status(201).json({ success:true, message:"Project created", data:project });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req,res)=>{
  try{
    delete req.body._id;
    delete req.body.user;

    if(req.body.members){
      req.body.members = [...new Set(req.body.members.map(String))];

      const validMembers = await Member.find({ _id: { $in: req.body.members } });
      if(validMembers.length !== req.body.members.length){
        return res.status(400).json({ success:false, message:"Some members do not exist" });
      }
    }

    const project = await Project.findOneAndUpdate(
      { _id:req.params.id, user:req.user._id },
      req.body,
      { new:true }
    ).populate("members");

    if(!project) return res.status(404).json({ success:false, message:"Project not found" });
    res.status(200).json({ success:true, message:"Project updated", data:project });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req,res)=>{
  try{
    const project = await Project.findOneAndDelete({ _id:req.params.id, user:req.user._id });
    if(!project) return res.status(404).json({ success:false, message:"Project not found" });
    res.status(200).json({ success:true, message:"Project deleted", data:project });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// GET STATS
exports.getStats = async (req,res)=>{
  try{
    const totalProjects = await Project.countDocuments({ user:req.user._id });
    const activeProjects = await Project.countDocuments({ user:req.user._id, status:'active' });
    const completedProjects = await Project.countDocuments({ user:req.user._id, status:'completed' });
    const teamSize = await Member.countDocuments();

    res.status(200).json({
      success:true,
      data:{ totalProjects, activeProjects, completedProjects, teamSize }
    });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};
