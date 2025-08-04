import React from 'react';

export default function ProfileCard({ id, name, email, bio, greeting }) {
    return (
        <div className="profile-card">
            <div className="avatar">{name ? name.charAt(0).toUpperCase() : id.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
                <div className="profile-item">
                    <span className="label">Name:</span>
                    <span className="value">{name}</span>
                </div>
                <div className="profile-item">
                    <span className="label">ID:</span>
                    <span className="value monospace">{id}</span>
                </div>
                <div className="profile-item">
                    <span className="label">Email:</span>
                    <span className="value">{email}</span>
                </div>
                {bio && (
                    <div className="profile-item">
                        <span className="label">Bio:</span>
                        <span className="value">{bio}</span>
                    </div>
                )}
                {greeting && (
                    <div className="profile-greeting">
                        {greeting}
                    </div>
                )}
            </div>
        </div>
    );
}
