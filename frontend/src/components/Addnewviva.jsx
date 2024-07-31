import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom";

function Addnewviva() {
  const [opendialog, setopendialog] = useState(false);
  const [specialization, setspecialization] = useState("");
  const [description, setdescription] = useState("");
  const [difficulty, setdifficulty] = useState("");
  const [loading,setloading] = useState(false);
  const {user} = useUser();
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/handle-viva-data/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            specialization,
            description,
            difficulty,
            useremail : user?.primaryEmailAddress.emailAddress
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      let data = await response.json(); // Parse the JSON response

      // Optional: Check if the response has an "answer" key
      if (data.answer) {
        // Remove leading and trailing markdown code blocks if necessar;
        console.log("Response from backend:", JSON.parse(data.answer) , "wheter inserted" , data.success);
        navigate("/interview/"+data.vivaid)
      } else {
        console.error("Response from backend: Missing answer key");
      }
      // Handle successful response with the parsed data (data.answer)
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error, e.g., show error message to the user
    }
    setloading(false)
  };

  return (
    <div>
      <div
        onClick={() => setopendialog(true)}
        className="p-10 border rounded-lg max-w-md bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      >
        <h1 className="font-bold text-lg text-center">+ Add new</h1>
      </div>
      <Dialog open={opendialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your viva
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={handlesubmit}>
                <h1>
                  Add details about your Specialization/field , decription ,
                  difficulty...
                </h1>
                <div className="mt-7 my-2">
                  <label>Specialization</label>
                  <Input
                    onChange={(e) => setspecialization(e.target.value)}
                    required
                    className="mt-2"
                    placeholder="eg . MBBS"
                  />
                </div>
                <div className="mt-5 my-2">
                  <label>
                    Description about the subject u want to take viva(in short)
                  </label>
                  <Textarea
                    onChange={(e) => setdescription(e.target.value)}
                    className="mt-2"
                    placeholder="Antomy of the body , Forensic Medicine,"
                    required
                  />
                </div>
                <div className="mt-5 my-2">
                  <label>Difficulty of the viva u want to have</label>
                  <Input
                    onChange={(e) => setdifficulty(e.target.value)}
                    className="mt-2"
                    placeholder="eg . easy/medium/hard"
                    required
                  />
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setopendialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {
                      loading==true ? <><LoaderCircle className="animate-spin"/> genrating from ai</> : "Start Interview"
                    }
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Addnewviva;
