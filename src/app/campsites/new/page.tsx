import CampsiteForm from '@/components/CampsiteForm'

export default function NewCampsitePage() {
    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">新しいキャンプ場記録を作成</h1>
            <CampsiteForm />
        </div>
    )
}
