import { PaymentStatus, Student } from "@/types/common";


const batches = [
    { id: "64d123aaa", name: "Batch A" },
    { id: "64d123bbb", name: "Batch B" },
    { id: "64d123ccc", name: "Batch C" },
];

const firstNames = ["John", "Jane", "Alex", "Sam", "Chris", "Taylor", "Jordan", "Riley", "Morgan", "Cameron"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson"];

function randomChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPhone() { return `+1 (${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`; }
function randomAddress() { return `${Math.floor(10 + Math.random() * 990)} Main St, Cityville`; }

export function generateMockStudents(count = 60): Student[] {
    const items: Student[] = [];
    for (let i = 0; i < count; i++) {
        const first = randomChoice(firstNames);
        const last = randomChoice(lastNames);
        const name = `${first} ${last}`;
        const batch = randomChoice(batches);
        const paymentStatus: PaymentStatus = randomChoice(["pending", "success", "failed"]);
        items.push({
            _id: `id_${i + 1}`,
            name,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
            studentId: `STU-${(10000 + i).toString()}`,
            batch,
            address: randomAddress(),
            phone: randomPhone(),
            paymentStatus,
            createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
        });
    }
    return items;
}

export const mockBatches = batches;
