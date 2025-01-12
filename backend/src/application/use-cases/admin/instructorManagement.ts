import Instructor from "../../../domain/models/InstructorDocument";
import User from "../../../domain/models/User";
import { InstructorDocumentRepository } from "../../../infrastructure/repositories/instructorDocumentRepository";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

const instructorRequestRepository = new InstructorDocumentRepository();
const userRepository = new UserRepositoryImpl();
export const getInstructors = async () => {
  const instructorsList =
    await instructorRequestRepository.getInstructorRequests();
  if (!instructorsList) {
    throw new CustomError("Failed to get instructors list", 400);
  }
  return instructorsList;
};

export const getInstructorApplication = async (id: string) => {
  const instructor = await instructorRequestRepository.getInstructorRequest(id);
  if (!instructor) {
    throw new CustomError("Failed to get instructors list", 400);
  }
  return instructor;
};

export const actionInstructorApplication = async (
  id: string,
  status: string
) => {
  const instructor = await instructorRequestRepository.findById(id);
  if (!instructor) {
    throw new CustomError(
      "Instructor data not found , cannot update data",
      400
    );
  }
  if (!status) {
    throw new CustomError("Status not provided", 400);
  }
  if (status === "approved") {
      const updateRole = await userRepository.updateUserRoleAdmin(
        instructor.instructorId.toString(),
        "instructor"
      );

      if(!updateRole) {
        throw new CustomError('Error updating user status', 400)
      }
      console.log("user role updated");
  }
  instructor.status = status;
  const updatedDoc = await instructorRequestRepository.update(instructor);
  return updatedDoc;
};
