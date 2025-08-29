import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { MapPin, DollarSign, Clock, CheckCircle, Navigation, Image as ImageIcon, KeyRound } from 'lucide-react'
import axios from 'axios'

export default function JobCard({ job, onUpdate, showActions = true }: { job: any; onUpdate?: () => void; showActions?: boolean }) {
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const acceptJob = async () => {
    await axios.put(`/api/jobs/${job.id}/accept`)
    onUpdate && onUpdate()
  }
  const onTheWay = async () => {
    await axios.put(`/api/jobs/${job.id}/on-the-way`)
    onUpdate && onUpdate()
  }
  const startJob = async () => {
    await axios.put(`/api/jobs/${job.id}/start`)
    onUpdate && onUpdate()
  }
  const openComplete = () => {
    setShowCompleteModal(true)
  }
  const uploadProof = async () => {
    if (!proofFile) return
    const fd = new FormData()
    fd.append('file', proofFile)
    fd.append('jobId', String(job.id))
    await axios.post('/api/upload/job-proof', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
  const verifyCompletionOtp = async () => {
    setVerifying(true)
    try {
      await uploadProof()
      const res = await axios.post(`/api/jobs/${job.id}/complete/verify-otp`, { phone, otp })
      setVerified(true)
    } finally {
      setVerifying(false)
    }
  }
  const completeJob = async () => {
    if (!verified) return
    await axios.put(`/api/jobs/${job.id}/complete`)
    setShowCompleteModal(false)
    onUpdate && onUpdate()
  }

  return (
    <Card className="glass rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{job.title}</span>
          {job.budget && (
            <span className="text-sm flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.budget}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {job.description && <p className="text-sm text-muted-foreground mb-3">{job.description}</p>}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {job.address && (<span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.address}</span>)}
          {job.scheduledAt && (<span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(job.scheduledAt).toLocaleString()}</span>)}
        </div>
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {job.status === 'OPEN' && (<Button variant="gradient" onClick={acceptJob}>Accept</Button>)}
            {job.status === 'ASSIGNED' && (<Button variant="outline" onClick={onTheWay}><Navigation className="w-4 h-4 mr-1" />On the way</Button>)}
            {job.status === 'ASSIGNED' && (<Button variant="gradient" onClick={startJob}>Start</Button>)}
            {job.status === 'IN_PROGRESS' && (
              <>
                <Button variant="outline" onClick={openComplete}><ImageIcon className="w-4 h-4 mr-1" />Proof & OTP</Button>
                <Button variant="gradient" onClick={completeJob} disabled={!verified}><CheckCircle className="w-4 h-4 mr-1" />Complete</Button>
              </>
            )}
          </div>
        )}

        {showCompleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="glass rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Complete Job</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Completion Photo</label>
                  <input type="file" accept="image/*" onChange={e => setProofFile((e.target.files && e.target.files[0]) || null)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Customer Phone</label>
                  <input className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2" placeholder="Enter customer's phone" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Completion OTP</label>
                  <div className="flex gap-2">
                    <input className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                    <Button variant="outline" onClick={verifyCompletionOtp} disabled={verifying || !proofFile || !phone || !otp}>
                      <KeyRound className="w-4 h-4 mr-1" />Verify
                    </Button>
                  </div>
                  {verified && <p className="text-xs text-green-500 mt-1">OTP verified. You can complete the job.</p>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
                  <Button variant="gradient" onClick={completeJob} disabled={!verified}><CheckCircle className="w-4 h-4 mr-1" />Complete</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
