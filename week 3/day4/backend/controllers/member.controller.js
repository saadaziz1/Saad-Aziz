const Member = require("../models/member.model");
const Project = require("../models/project.model");

exports.getMembers = async (req,res)=>{
  try{
    const members = await Member.find();
    res.status(200).json({ success:true, data:members });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

exports.getMemberById = async (req,res)=>{
  try{
    const member = await Member.findById(req.params.id);
    if(!member) return res.status(404).json({ success:false, message:"Member not found" });
    res.status(200).json({ success:true, data:member });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

exports.createMember = async (req,res)=>{
  try{
    const member = await Member.create(req.body);
    res.status(201).json({ success:true, data:member });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

exports.updateMember = async (req,res)=>{
  try{
    delete req.body._id;
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new:true });
    if(!member) return res.status(404).json({ success:false, message:"Member not found" });
    res.status(200).json({ success:true, data:member });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};

// DELETE MEMBER -> remove from all projects
exports.deleteMember = async (req,res)=>{
  try{
    const member = await Member.findByIdAndDelete(req.params.id);
    if(!member) return res.status(404).json({ success:false, message:"Member not found" });

    // remove from projects
    await Project.updateMany({ members: member._id }, { $pull: { members: member._id } });

    res.status(200).json({ success:true, message:"Member deleted and removed from projects" });
  }catch(err){
    res.status(500).json({ success:false, message:err.message });
  }
};
