import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const parseJsonResponse = async (res) => {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error("Server returned an invalid response. Please restart the backend and try again.");
  }
};

function Profile() {

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState(storedUser);
  const [name, setName] = useState(storedUser.name || "");
  const [previewImage, setPreviewImage] = useState(storedUser.profileImage || "");
  const [saving, setSaving] = useState(false);

  const userId = storedUser.userId;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`https://personal-finance-ai-advisor-1.onrender.com/api/users/${userId}`);
        const data = await parseJsonResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setProfile(data);
        setName(data.name || "");
        setPreviewImage(data.profileImage || "");
        localStorage.setItem("user", JSON.stringify(data));

      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name
      };

      if (previewImage !== undefined) {
        payload.profileImage = previewImage;
      }

      const res = await fetch(`https://personal-finance-ai-advisor-1.onrender.com/api/users/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await parseJsonResponse(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data);
      setName(data.name || "");
      setPreviewImage(data.profileImage || "");
      localStorage.setItem("user", JSON.stringify(data));
      alert("Profile updated");

    } catch (error) {
      console.error(error);
      alert(error.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const accountName = profile?.email
    ? profile.email.split("@")[0]
    : "FinanceAI Account";

  return (
    <Layout>

      <div className="page-card profile-page-card">

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="profile-avatar-image" />
              ) : (
                <span>{(name || "F").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <p className="dashboard-form-eyebrow">Profile</p>
              <h2 className="dashboard-form-title">My Account</h2>
              <p className="dashboard-form-subtitle">
                Manage your personal details and display picture.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="dashboard-form profile-form">
            <div className="dashboard-field">
              <label className="dashboard-label">Profile Picture</label>
              <input
                className="dashboard-input profile-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="dashboard-field">
              <label className="dashboard-label">Name</label>
              <input
                className="dashboard-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="profile-info-grid">
              <div className="profile-info-card">
                <span className="profile-info-label">Email</span>
                <strong>{profile?.email || "-"}</strong>
              </div>

              <div className="profile-info-card">
                <span className="profile-info-label">Account Name</span>
                <strong>{accountName}</strong>
              </div>

              <div className="profile-info-card">
                <span className="profile-info-label">Join Date</span>
                <strong>
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "-"}
                </strong>
              </div>
            </div>

            <button type="submit" className="dashboard-submit" disabled={saving}>
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>

      </div>

    </Layout>
  );
}

export default Profile;
