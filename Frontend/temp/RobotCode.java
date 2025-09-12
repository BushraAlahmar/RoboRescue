// Interface definition
interface Roboter {
    void starten();
    void stoppen();
    void bewegen();
    String getStatus();
    int getEnergieLevel();
}

// Abstrakte Basisklasse mit gemeinsamer Implementierung
public abstract class AbstractRoboter implements Roboter {
    protected String status;
    protected int energieLevel;
    protected String typ;

    public AbstractRoboter(String typ, int initialEnergie) {
        this.typ = typ;
        this.status = "Bereit";
        this.energieLevel = initialEnergie;
    }

    @Override
    public void starten() {
        status = "Aktiv";
        System.out.println(typ + " gestartet.");
    }

    @Override
    public void stoppen() {
        status = "Gestoppt";
        System.out.println(typ + " gestoppt.");
    }

    @Override
    public void bewegen() {
        status = "In Bewegung";
        verbraucheEnergie(getBewegungsEnergieVerbrauch());
        System.out.println(typ + " bewegt sich.");
    }

    // Overloaded method for movement with coordinates
    public void bewegen(int x, int y) {
        status = "In Bewegung";
        verbraucheEnergie(getBewegungsEnergieVerbrauch());
        System.out.println(typ + " bewegt sich zu Position (" + x + "," + y + ")");
    }

    @Override
    public String getStatus() {
        return status;
    }

    @Override
    public int getEnergieLevel() {
        return energieLevel;
    }

    // Abstract methods that subclasses must implement
    protected abstract int getBewegungsEnergieVerbrauch();
    
    protected void verbraucheEnergie(int verbrauch) {
        energieLevel = Math.max(0, energieLevel - verbrauch);
    }
}

// Main class to run the program
public class Main {
    public static void main(String[] args) {
        System.out.println("Robot Program Started!");
        
        // Example usage would go here
        // You would need to create concrete implementations of AbstractRoboter
        System.out.println("Program completed successfully!");
    }
} 