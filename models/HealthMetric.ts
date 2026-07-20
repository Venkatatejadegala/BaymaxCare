import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthMetric {
  userId: mongoose.Types.ObjectId;
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  bloodSugar?: number;
  oxygenSaturation?: number;
  bodyTemperature?: number;
  sleepHours?: number;
  waterIntake?: number;
  steps?: number;
  notes?: string;
  recordedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const HealthMetricSchema = new Schema<IHealthMetric>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    weight: {
      type: Number,
      min: [0, 'Weight must be a positive number'],
    },
    height: {
      type: Number,
      min: [0, 'Height must be a positive number'],
    },
    bloodPressureSystolic: {
      type: Number,
      min: [0, 'Blood pressure systolic must be a positive number'],
    },
    bloodPressureDiastolic: {
      type: Number,
      min: [0, 'Blood pressure diastolic must be a positive number'],
    },
    heartRate: {
      type: Number,
      min: [0, 'Heart rate must be a positive number'],
    },
    bloodSugar: {
      type: Number,
      min: [0, 'Blood sugar level must be a positive number'],
    },
    oxygenSaturation: {
      type: Number,
      min: [0, 'Oxygen saturation cannot be below 0%'],
      max: [100, 'Oxygen saturation cannot exceed 100%'],
    },
    bodyTemperature: {
      type: Number,
      min: [0, 'Body temperature must be a positive number'],
    },
    sleepHours: {
      type: Number,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24 hours in a day'],
    },
    waterIntake: {
      type: Number,
      min: [0, 'Water intake cannot be negative'],
    },
    steps: {
      type: Number,
      min: [0, 'Steps count cannot be negative'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    recordedAt: {
      type: Date,
      required: [true, 'Record timestamp is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize search speed for fetching user metric histories sorted by date
HealthMetricSchema.index({ userId: 1, recordedAt: -1 });

const HealthMetric: mongoose.Model<IHealthMetric> =
  mongoose.models.HealthMetric ||
  mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);

export { HealthMetric };
