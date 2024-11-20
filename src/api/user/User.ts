import User from "../../database/models/user";
import { Request, Response } from "express";

export const deleteUser = async (_req: Request, res: Response) => {
  const { id } = _req.params;

  if (!id) {
    res.status(400).json({ error: "No se ha encontrado un id válido" });
    return;
  }

  try {
    
    const deleted = await User.findByIdAndDelete(id);
  
    if (!deleted) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
  
    res.status(200).json({ _id: deleted.id });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }


}

export const updateUser = async (req: Request, res: Response) => {
  const { _id, firstName, lastName } = req.body

  if(!_id || !firstName || !lastName) {
    res.status(400).json({ error: "La peticion es invalida" });
    return;
  }

  const updateData: Partial<{ firstName: string; lastName: string; }> ={};

  if(firstName) updateData.firstName = firstName;
  if(lastName) updateData.lastName = lastName;

  try {
    const updated = await User.findByIdAndUpdate(_id, updateData, { new: true });
    if(!updated) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ _id: updated.id, firstName: updated.firstName, lastName: updated.lastName});
  } catch(err) {
    console.log(err)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}